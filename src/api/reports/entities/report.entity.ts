import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReportStatus } from "../enums/report-status.enum";
import { User } from "src/api/users/entities/user.entity";
import { ReportImage } from "./report-image.entity";

@Entity('reports')
export class Report {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
  
  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.EnEspera
  })
  status: ReportStatus;

  @ManyToOne(
    () => User,
    user => user.reports,
    { onDelete: 'CASCADE', nullable: false, eager: true }
  )
  @JoinColumn({name: 'user_id'})
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => ReportImage,
    reportImage => reportImage.report,
    { cascade: true, eager: true }
  )
  images?: ReportImage[];

}