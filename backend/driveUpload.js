const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');


// Path to the service account key file (use absolute path directly)
const KEYFILEPATH = "------------";

// Scopes for Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Authenticate with the Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

async function uploadFile(filePath) {
    try {
        // Metadata for the file
        const fileMetadata = {
            'name': path.basename(filePath), // Name of the file in Google Drive
        };

        // File media for upload
        const media = {
            mimeType: 'application/octet-stream',
            body: fs.createReadStream(filePath),
        };

        // Upload the file
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        const fileId = response.data.id;
        console.log('File uploaded successfully, File ID:', fileId);

        // Share the file with your personal email
        await shareFile(fileId, "Enter The Email Address");

    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

async function shareFile(fileId, emailAddress) {
    try {
        await drive.permissions.create({
            fileId: fileId,
            resource: {
                type: 'user',
                role: 'writer', // Change to 'reader' for view-only access
                emailAddress: emailAddress,
            },
        });
        console.log(`File shared with ${emailAddress}`);
    } catch (error) {
        console.error('Error sharing file:', error);
    }
}

// Example usage:
const filePath = process.argv[2]
if (filePath) {
    uploadFile(filePath);
} else {
    console.error('Please provide the file path as a command-line argument.');
    process.exit(1);
}