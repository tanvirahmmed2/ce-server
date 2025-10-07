const Event = require("../model/event.model")


const getEvents = async (req, res) => {
    try {
        const events = await Event.find({})
        if (!events) {
            return res.status(400).send({
                success: false,
                message: 'no event found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'Events data fetched successfully',
            payload: events
        })
    } catch (error) {
        res.status(500).send({
            sucees: false,
            message: 'Event fetching failed',
            error: error
        })

    }

}


const addEvent = async (req, res) => {
    try {
        const { title, description, day, month, year, location, registration } = req.body
        if (!title || !description || !day || !month || !year || !location || !registration) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required'
            })
        }
        const newEvent = new Event({ title, description, day, month, year, location, registration })
        await newEvent.save()
        res.status(200).send({
            success: true,
            message: 'Succesfully created event',
            payload: newEvent
        })
    } catch (error) {
        res.status(500).send({
            sucees: false,
            message: 'Event creation failed',
            error: error
        })
    }
}

const deleteEvent=async(req,res)=>{}

module.exports = {
    getEvents,
    addEvent,
    deleteEvent
}