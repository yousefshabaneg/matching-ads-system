import { expect } from "chai";
import request from "supertest";
import server from "../src/server"; // Adjust the path to your app
import UserModel from "../src/modules/user/user.model";
import { closeConnection } from "../src/shared/config/database";

const admin = {
  name: "Admin",
  phone: "01234567890",
  role: "ADMIN",
  password: "12345678",
  passwordConfirm: "12345678",
};
const client = {
  name: "Client",
  phone: "01234567891",
  role: "CLIENT",
  password: "12345678",
  passwordConfirm: "12345678",
};
const agent = {
  name: "Yousef2",
  phone: "01234567892",
  role: "AGENT",
  password: "12345678",
  passwordConfirm: "12345678",
};

let adminToken: string;
let clientToken: string;

before(async () => {
  const createdModels = await UserModel.create([admin, client, agent]);
  const loginResponse = await request(server)
    .post("/auth/login")
    .send({ phone: admin.phone, password: admin.password });

  adminToken = loginResponse.body.token;
  const userTokenResponse = await request(server)
    .post("/auth/login")
    .send({ phone: client.phone, password: client.password });

  clientToken = userTokenResponse.body.token;
});

describe("Admin Stats Endpoint 1", () => {
  it("should return stats for a given user", async () => {
    const response = await request(server)
      .get("/user/stats")
      .set("Authorization", `Bearer ${adminToken}`);
    response.body.data.forEach((user: any) => {
      expect(user).to.have.property("name");
      expect(user).to.have.property("phone");
      expect(user).to.have.property("role");
      expect(user).to.have.property("status");
      expect(user).to.have.property("adsCount");
      expect(user).to.have.property("totalAdsAmount");
      expect(user).to.have.property("requestsCount");
      expect(user).to.have.property("totalRequestsAmount");
    });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.be.an("array");
  });

  it("should return a 403 if a non-admin user tries to access the stats", async () => {
    const response = await request(server)
      .get("/user/stats")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(response.status).to.equal(403);
  });
});

after(async () => {
  await UserModel.deleteMany({});
  server.close();
  return closeConnection();
});
