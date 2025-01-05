import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const allowedStatus = ["interested", "ignored"];
    const status = req.params.status;
    const isStatusAllowed = allowedStatus.includes(status);

    if (!isStatusAllowed) {
      throw new Error("Invalid Status type: " + status);
    }

    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      throw new Error("User is not in DB : " + toUserId);
    }

    const savedConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (savedConnectionRequest) {
      throw new Error("Request are already there to or from : " + toUserId);
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    const message =
      status === "interested"
        ? `${req?.user?.fullName} is ${status} in ${toUser.fullName}`
        : `${req?.user?.fullName} ${status} ${toUser.fullName}`;
    res.status(200).json({ message, data });
  } catch (error) {
    console.error("Error in sendConnectionRequest: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { requestedId, status } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status type " + status);
    }

    const requestedConnectionRequest = await ConnectionRequest.findOne({
      _id: requestedId,
    });

    if (requestedConnectionRequest) {
      if (
        requestedConnectionRequest.toUserId === loggedInUser._id ||
        requestedConnectionRequest.status === "interested"
      ) {
        requestedConnectionRequest.status = status;

        await requestedConnectionRequest.save();
        res.json({
          message: `connection request ${status} successfully`,
          data: requestedConnectionRequest,
        });
      } else {
        throw new Error("You don't have any pending connection request");
      }
    } else {
      throw new Error("No connection request found ", requestedId);
    }
  } catch (error) {
    console.error("Error in reviewConnectionRequest: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
