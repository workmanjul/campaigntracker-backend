import { Migration } from '@mikro-orm/migrations';

export class Migration20230515190324 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` modify `id` varchar(36) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` modify `id` varchar(255) not null;');
  }

}
