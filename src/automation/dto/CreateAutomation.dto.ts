import { Row } from '../Row';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateAutomationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  budgetType: string;
  options: string;
  status: string;
  actionStatus: string;
  budgetPercent: string | null;
  budgetAmount: string | null;
  automationInMinutes: string;
  displayText: string;
  postToDatabase: boolean;
  data: Row[];
  lastRun: string | null;
  nextRun: string | null;
  blockAdset: string | null;
  includeAdset: string | null;
  numOfDuplicateAdSet: string | null;
  duplicateAdSetAmount: string | null;
  duplicateAdSetName: string | null;
}
