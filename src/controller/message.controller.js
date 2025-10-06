const Message = require("../model/message.model")


const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({});

        if (!messages || messages.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No messages found'
            });
        }

        res.status(200).send({
            success: true,
            payload: messages
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error: error.message || error
        });
    }
}


const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body
        if (!name || !email || !subject || !message) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            });
        }
        const newMessage = new Message({ name, email, subject, message })

        await newMessage.save()
        res.status(200).send({
            success: false,
            message: 'Successfully sent message'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'failed to sent message',
            error: error.message || error
        });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Message id not found'
            });
        }
        const deleted = await Message.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Successfully deleted message'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: error.message || error
        });
    }
}



module.exports = {
    getMessages,
    sendMessage,
    deleteMessage
}