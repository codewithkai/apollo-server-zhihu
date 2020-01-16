import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class Follow {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  zhihuPeopleId: string;
}
