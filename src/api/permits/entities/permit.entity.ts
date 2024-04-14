import { Departments } from "src/api/reports/enums/departments.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermitFile } from "./permit-file.entity";
import { Report } from "src/api/reports/entities/report.entity";
import { User } from "src/api/users/entities/user.entity";

@Entity('permits')
export class Permit {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  details: string;

  @Column()
  budget: number;

  @Column()
  authorized_time: Date;

  @Column({
    type: 'enum',
    enum: Departments
  })
  department: Departments;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => PermitFile,
    permitFile => permitFile.permit
  )
  files?: PermitFile[];

  @ManyToOne(
    () => Report,
    report => report.permits
  )
  report: Report;

  @ManyToOne(
    () => User,
    user => user.permits
  )
  user: User;

}
