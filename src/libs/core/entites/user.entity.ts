import { IsEmail, IsNotEmpty, IsOptional, MaxLength, validateSync } from 'class-validator';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Group } from './group.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 128 })
    @MaxLength(128)
    @IsOptional()
    password: string;

    @UpdateDateColumn({ name: 'last_login', nullable: true })
    lastLogin: Date;

    @Column({ name: 'is_superuser' })
    @IsNotEmpty()
    isSuperuser: boolean;

    @Column({ length: 150, unique: true })
    @IsNotEmpty()
    @MaxLength(150)
    username: string;

    @Column({ name: 'first_name', length: 30 })
    @IsNotEmpty()
    @MaxLength(30)
    firstName: string;

    @Column({ name: 'last_name', length: 30 })
    @IsNotEmpty()
    @MaxLength(30)
    lastName: string;

    @Column({ length: 254 })
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email: string;

    @Column({ name: 'is_staff' })
    @IsNotEmpty()
    isStaff: boolean;

    @Column({ name: 'is_active' })
    @IsNotEmpty()
    isActive: boolean;

    @IsNotEmpty()
    @CreateDateColumn({ name: 'date_joined' })
    dateJoined: Date;

    @Column({ type: Date, name: 'date_of_birth', nullable: true })
    dateOfBirth: Date;

    @ManyToMany(type => Group, {
        cascade: ['insert', 'update', 'remove'],
        eager: true
    })
    @JoinTable({
        name: 'user_groups',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'group_id',
            referencedColumnName: 'id'
        }
    })
    groups: Group[];

    @BeforeInsert()
    doBeforeInsertion() {
        const errors = validateSync(this, { validationError: { target: false } });
        if (errors.length > 0) {
            throw errors;
        }
    }

    @BeforeUpdate()
    doBeforeUpdate() {
        const errors = validateSync(this, { validationError: { target: false } });
        if (errors.length > 0) {
            throw errors;
        }
    }

    makePassword(password: string) {
        return 'empty';
    }

    verifyPassword(password: string) {
        return true;
    }

    setPassword(password: string) {
        if (password) {
            this.password = this.makePassword(password);
        } else {
            this.password = undefined;
        }
    }
}