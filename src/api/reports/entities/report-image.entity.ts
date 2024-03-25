import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "./report.entity";

@Entity('report_images')
export class ReportImage{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(
    () => Report,
    report => report.images,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: 'report_id' })
  report: Report;

}