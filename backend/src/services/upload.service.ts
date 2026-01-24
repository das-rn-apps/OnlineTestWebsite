import { config } from '../config/env';

class UploadService {
    getLocalFileUrl(filename: string): string {
        // Assuming the app is hosted at process.env.BASE_URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/${filename}`;
    }

    // Future: implement deleteFile, uploadToCloud, etc.
}

export default new UploadService();
