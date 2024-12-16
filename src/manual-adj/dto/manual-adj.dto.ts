import { ManualAdjData } from "../ManualAdjData";

export class ManualAdjDto {

    adset_id: string;
    new_budget: number;
    duplicate: number;
    duplicate_budget: number;
    current_budget: number;
    post_to_database: boolean;
    adset_name: string;
}