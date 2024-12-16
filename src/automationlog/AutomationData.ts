import { Automation } from '@prisma/client';
import { Row } from 'src/automation/Row';

export interface AutomationData {
  automationId: number;
  actionDisplayText: string;
  rulesDisplay: string;
  adSetId: string;
  action: string;
  query: string;
  previous_value: string;
  new_value: string;
}
