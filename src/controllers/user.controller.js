import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

const USER_SAFE_DATA = ["fullName", "photoURL"];

export const getAllConnectionRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.status(200).json({
      message: "connection requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error in getAllConnectionRequests: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectedUser = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectedUser.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );

    res.status(200).json({
      message: "data fetched successfully",
      data: { length: data.length, data },
    });
  } catch (error) {
    console.error("Error in getAllConnections: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersForFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    limit = limit > 50 ? 50 : limit;

    const connectedUsers = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    console.log(connectedUsers);
    const hiddenUsersFromFeedId = connectedUsers.flatMap((connection) => [
      connection.fromUserId._id.toString(),
      connection.toUserId._id.toString(),
    ]);

    const hiddenUsersFromFeedId_unique = Array.from(
      new Set(hiddenUsersFromFeedId)
    );

    const allowedUsersOnFeed = await User.find({
      $and: [
        { _id: { $nin: hiddenUsersFromFeedId_unique } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "data fetched successfully",
      data: { length: allowedUsersOnFeed.length, data: allowedUsersOnFeed },
    });
  } catch (error) {
    console.error("Error in getAllConnections: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
