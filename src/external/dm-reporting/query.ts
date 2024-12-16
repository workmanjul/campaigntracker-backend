export const DataMigrationQuery = `
    INSERT INTO DmReporting (advertiser, domain, manager, buyer, start_time, campaignId, adset, adset_id, revenue, spend,
                             link_clicks, ad_clicks, gp, searches, clicks, tq,market,category,createdAt)

    SELECT *
    from (SELECT advertiser,
              domain,
              manager,
              buyer,
              start_time,
              campaignId,
              adset,
              adset_id,
              revenue,
              spend,
              link_clicks,
              ad_clicks,
              gp,
              searches,
              clicks,
              tq,
              market,
              category,
              createdAt
          FROM DmReportingHistory
          WHERE id IN (SELECT max(id)
              FROM DmReportingHistory
              GROUP BY adset_id, start_time)) i
        ON DUPLICATE KEY UPDATE revenue     = i.revenue,
                             spend       = i.spend,
                             link_clicks = i.link_clicks,
                             ad_clicks   = i.ad_clicks,
                             gp          = i.gp,
                             searches    = i.searches,
                             clicks      = i.clicks,
                             tq          = i.tq,
                             market      = i.market,
                             category    = i.category  
`;
