import { Migration } from '@mikro-orm/migrations';

export class Migration20230515192256 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `users` (`id` varchar(36) not null, `name` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `user`;');
  }

  async down(): Promise<void> {
    this.addSql('create table `user` (`id` varchar(36) not null, `username` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `users`;');
  }

}
