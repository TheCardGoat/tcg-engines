import { describe, expect, it } from "vitest";
import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { inspectionPose, inspectionSpreadPose } from "../src/inspection-pose";

describe("camera-independent card inspection", () => {
  it("centers a readable card on a perspective board without crossing the camera", () => {
    const camera = new PerspectiveCamera(40, 16 / 9, 1, 4000);
    camera.position.set(0, -645, 1900);
    camera.lookAt(0, -45, 0);
    camera.updateMatrixWorld();
    const pose = inspectionPose(camera, { distance: 1300, aspect: 5 / 7, viewportAspect: 16 / 9 });
    const center = new Vector3(pose.x, pose.y, pose.z).project(camera);
    expect(center.x).toBeCloseTo(0);
    expect(center.y).toBeCloseTo(0);
    expect(pose.z).toBeGreaterThan(85);
    expect(pose.z).toBeLessThan(camera.position.z);
    expect(pose.scale).toBeGreaterThan(0);
  });
  it("fits an orthographic XZ table and faces its top-down camera", () => {
    const camera = new OrthographicCamera(-10, 10, 6, -6, 0.1, 100);
    camera.position.set(0, 30, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const pose = inspectionPose(camera, { distance: 20, aspect: 5 / 7, viewportAspect: 20 / 12 });
    expect(pose.y).toBeCloseTo(10);
    expect(pose.rotationX).toBeCloseTo(-Math.PI / 2);
    expect(pose.scale / (5 / 7)).toBeCloseTo(12 * 0.72);
  });
  it("limits card width in narrow viewports", () => {
    const camera = new PerspectiveCamera(40);
    const pose = inspectionPose(camera, { distance: 10, aspect: 5 / 7, viewportAspect: 0.5 });
    const height = 2 * Math.tan((20 * Math.PI) / 180) * 10;
    expect(pose.scale).toBeCloseTo(height * 0.5 * 0.68);
  });
  it.each([
    [935 / 802, 4],
    [844 / 390, 8],
  ])("fits all eight preview cards and their corners at aspect %s", (aspect, columns) => {
    const camera = new PerspectiveCamera(40, aspect, 100, 4000);
    camera.position.set(0, -645, 1900);
    camera.lookAt(0, -45, 0);
    camera.updateMatrixWorld();
    const centers: Vector3[] = [];
    for (let index = 0; index < 8; index++) {
      const pose = inspectionSpreadPose(camera, {
        distance: 1300,
        aspect: 5 / 7,
        viewportAspect: aspect,
        heightFraction: 0.62,
        widthFraction: 0.9,
        count: 8,
        index,
        columns,
      });
      centers.push(new Vector3(pose.x, pose.y, pose.z).project(camera));
      for (const x of [-0.5, 0.5])
        for (const y of [-0.7, 0.7]) {
          const corner = new Vector3(x * pose.scale, y * pose.scale, 0)
            .applyQuaternion(camera.quaternion)
            .add(new Vector3(pose.x, pose.y, pose.z))
            .project(camera);
          expect(Math.abs(corner.x)).toBeLessThanOrEqual(0.90001);
          expect(Math.abs(corner.y)).toBeLessThanOrEqual(0.62001);
        }
      expect(pose.z).toBeGreaterThan(85);
      expect(pose.rotationX).toBeCloseTo(camera.rotation.x);
    }
    expect(centers[0].x).toBeLessThan(centers[1].x);
    if (columns === 4) expect(centers[0].y).toBeGreaterThan(centers[4].y);
  });
});
