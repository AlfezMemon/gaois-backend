import CommonService from '../../utils/common.services.js';
import Logger from '../../utils/loggers.js';
const logger = new Logger().createMyLogger('FeeController');

export default class FeeController {
    /* Add fee entry */
    static async addFeeEntry(req, res) {
        let student_id = req.params.id;
        let { monthly_fee, received_amount, received_date, paymentMode } = req.body;
        let data = {
            student_id: student_id,
            monthly_fee: parseFloat(monthly_fee),
            received_amount: parseFloat(received_amount),
            received_date: received_date,
            paymentMode: paymentMode,
        }
        // let data = req.body;

        let previousFeeData = await CommonService.getByID("student", data.student_id);
        previousFeeData = previousFeeData.data;

        let carried_forward = previousFeeData.carried_forward;
        let remaining_fees = previousFeeData.remaining_fees;
        let monthly_fees = previousFeeData.monthly_fees;

        carried_forward = carried_forward + data.received_amount;
        logger.info("total_recieved = " + carried_forward);

        carried_forward = carried_forward - (monthly_fees + remaining_fees);

        if (carried_forward >= 0) {
            carried_forward = carried_forward;
            remaining_fees = 0;
        }
        else {
            remaining_fees = Math.abs(carried_forward);
            carried_forward = 0;
        }

        logger.info("Carried forward = " + carried_forward);
        logger.info("Remaining = " + remaining_fees);
        data.monthly_fees = monthly_fees;
        let response = await CommonService.create(req.model, data);
        let updateEntry = await CommonService.update('student', { _id: previousFeeData._id }, { carried_forward: carried_forward, remaining_fees: remaining_fees }, false, false);

        res.status(200).json(response);
    }

    
}