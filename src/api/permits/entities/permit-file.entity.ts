import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permit } from "./permit.entity";

@Entity('permit_files')
export class PermitFile{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(
    () => Permit,
    permit => permit.files,
    { eager: true }
  )
  @JoinColumn({ name: 'permit_id' })
  permit: Permit;

}