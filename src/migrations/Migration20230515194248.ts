import { Migration } from '@mikro-orm/migrations';

export class Migration20230515194248 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `id` varchar(32) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` modify `id` varchar(36) not null;');
  }

}
