export const SyncQuery = `
insert into AdSets (status, adaccount_id, name, country,daily_budget, created_time, start_time, createdAt, adset_id)
SELECT *
from (select status,
             adaccount_id,
             name,
             country,
             daily_budget,
             created_time,
             start_time,
             createdAt,
             adset_id
      FROM AdSetsHistory
      WHERE id IN (SELECT max(id)
                   FROM AdSetsHistory
                   GROUP BY AdSetsHistory.adset_id)) i
ON DUPLICATE KEY UPDATE status       = i.status,
                        daily_budget = i.daily_budget,
                        createdAt    = i.createdAt,
                        country = i.country
`;
