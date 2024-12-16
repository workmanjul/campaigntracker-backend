import { Migration } from '@mikro-orm/migrations';

export class Migration20230516140748 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `ad_accounts` (`id` varchar(32) not null, `source` varchar(20) not null default \'facebook\', `account_id` varchar(30) not null, `name` varchar(255) not null, `time_zone` varchar(100) not null, `status` varchar(20) not null, `updated_date` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `ad_accounts`;');
  }

}
