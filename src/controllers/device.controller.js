// Device controller

import { getDevice } from "../services/device.service.js";
import { sendSuccess, sendNotFound } from "../utils/response.util.js";
import { MESSAGES } from "../constants/messages.constant.js";

export const getDeviceDetails = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const deviceData = await getDevice(deviceId);

    if (!deviceData || deviceData.length === 0) {
      return sendNotFound(res, MESSAGES.DEVICE_NOT_FOUND);
    }

    return sendSuccess(res, deviceData[0], MESSAGES.DEVICE_FETCHED);
  } catch (error) {
    next(error);
  }
};
