import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  report: Report;

}