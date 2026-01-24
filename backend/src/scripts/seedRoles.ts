// import mongoose from 'mongoose';
// import { config } from '../config/env';
import { connectDatabase } from '../config/database';
import Role from '../models/Role.model';
import { ROLES, PERMISSIONS } from '../config/constants';
import logger from '../services/logger.service';

const rolePermissions = {
    [ROLES.STUDENT]: [],
    [ROLES.EXAMINER]: [
        PERMISSIONS.QUESTION_READ,
        PERMISSIONS.QUESTION_WRITE,
        PERMISSIONS.TEST_READ,
    ],
    [ROLES.ADMIN]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_WRITE,
        PERMISSIONS.EXAM_READ,
        PERMISSIONS.EXAM_WRITE,
        PERMISSIONS.TEST_READ,
        PERMISSIONS.TEST_WRITE,
        PERMISSIONS.TEST_PUBLISH,
        PERMISSIONS.QUESTION_READ,
        PERMISSIONS.QUESTION_WRITE,
        PERMISSIONS.QUESTION_DELETE,
        PERMISSIONS.RESULT_READ_ALL,
        PERMISSIONS.RESULT_RECALCULATE,
        PERMISSIONS.ANALYTICS_READ_ALL,
        PERMISSIONS.SUBSCRIPTION_MANAGE,
        PERMISSIONS.COUPON_MANAGE,
    ],
    [ROLES.SUPER_ADMIN]: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_WRITE,
        PERMISSIONS.USER_DELETE,
        PERMISSIONS.EXAM_READ,
        PERMISSIONS.EXAM_WRITE,
        PERMISSIONS.EXAM_DELETE,
        PERMISSIONS.TEST_READ,
        PERMISSIONS.TEST_WRITE,
        PERMISSIONS.TEST_DELETE,
        PERMISSIONS.TEST_PUBLISH,
        PERMISSIONS.QUESTION_READ,
        PERMISSIONS.QUESTION_WRITE,
        PERMISSIONS.QUESTION_DELETE,
        PERMISSIONS.RESULT_READ_ALL,
        PERMISSIONS.RESULT_RECALCULATE,
        PERMISSIONS.ANALYTICS_READ_ALL,
        PERMISSIONS.SUBSCRIPTION_MANAGE,
        PERMISSIONS.COUPON_MANAGE,
    ],
};

const seedRoles = async () => {
    try {
        await connectDatabase();

        logger.info('Seeding roles...');

        for (const [roleName, permissions] of Object.entries(rolePermissions)) {
            await Role.findOneAndUpdate(
                { name: roleName },
                {
                    name: roleName,
                    displayName: roleName.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                    permissions,
                },
                { upsert: true, new: true }
            );
            logger.info(`Role ${roleName} created/updated`);
        }

        logger.info('Roles seeded successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();
