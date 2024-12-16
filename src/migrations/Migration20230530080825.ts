import { Migration } from '@mikro-orm/migrations';

export class Migration20230530080825 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `dm_reporting_history` (`id` varchar(32) not null, `advertiser` varchar(255) null, `domain` varchar(255) null, `manager` varchar(255) null, `buyer` varchar(255) null, `date` datetime null, `hour` int null, `campaign` varchar(255) null, `adset` varchar(255) null, `adsetid` int null, `revenue` int null, `spend` int null, `link_clicks` int null, `ad_clicks` int null, `gp` int null, `searches` int null, `clicks` int null, `tq` int null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `external_api`;');
  }

  async down(): Promise<void> {
    this.addSql('create table `external_api` (`id` varchar(32) not null, `advertiser` varchar(255) null, `domain` varchar(255) null, `manager` varchar(255) null, `buyer` varchar(255) null, `date` varchar(255) null, `hour` int null, `campaign` varchar(255) null, `adset` varchar(255) null, `adsetid` int null, `revenue` int null, `spend` int null, `link_clicks` int null, `ad_clicks` int null, `gp` int null, `searches` int null, `clicks` int null, `tq` int null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `dm_reporting_history`;');
  }

}
