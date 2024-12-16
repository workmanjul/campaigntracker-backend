import { Migration } from '@mikro-orm/migrations';

export class Migration20230525060547 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `ad_sets` (`id` varchar(32) not null, `status` varchar(255) null, `facebook_id` varchar(255) null, `adaccount_id` varchar(255) null, `name` varchar(255) null, `daily_budget` varchar(255) null, `created_time` varchar(255) null, `start_time` varchar(255) null, `created_at` datetime null, `updated_at` datetime null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `ad_sets`;');
  }
}
