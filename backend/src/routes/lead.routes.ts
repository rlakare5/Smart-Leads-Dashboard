import { Router } from 'express';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLeadById,
  getLeads,
  updateLead,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createLeadValidator,
  exportLeadsQueryValidator,
  getLeadsQueryValidator,
  leadIdValidator,
  updateLeadValidator,
} from '../validators/lead.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(getLeadsQueryValidator), getLeads);
router.get('/export/csv', validate(exportLeadsQueryValidator), exportLeadsCsv);
router.get('/:id', validate(leadIdValidator), getLeadById);
router.post('/', validate(createLeadValidator), createLead);
router.put('/:id', validate(updateLeadValidator), updateLead);
router.delete('/:id', authorize('admin'), validate(leadIdValidator), deleteLead);

export default router;
