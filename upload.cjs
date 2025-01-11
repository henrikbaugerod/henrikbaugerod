let Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

require('dotenv').config()

const { FTP_UPLOAD_DIR, FTP_HOST, FTP_PASS, FTP_USER, FTP_PORT } = process.env

const localBuildDir = path.join(__dirname, 'dist'); // Lokalt bygg-mappe
const remoteBuildDir = FTP_UPLOAD_DIR

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = {
    host: FTP_HOST, // Serveradresse
    username: FTP_USER,    // Brukernavn
    password: FTP_PASS, // Passord
    port: FTP_PORT,
    dir: FTP_UPLOAD_DIR
};



const uploadFiles = async () => {
    let client = new Client();
    console.log(config)
    try {
        console.log('Trying to connect server')
        await client.connect(config);
        console.log('Successfully connected')

        console.log('Trying to delete prod folder')
        const prodExists = await client.exists(remoteBuildDir);

        if (prodExists) {
            const rmdir = await client.rmdir(remoteBuildDir, true);
            console.log(rmdir)
        }

        const mkdir = await client.mkdir(remoteBuildDir);
        console.log(mkdir)

        // Create the _temp folder within the remote build directory
        const tempMkdir = await client.mkdir('/var/www/0/1275247/www/_temp', true);
        console.log('_temp folder created inside remote build directory:', tempMkdir);

        // Ensure .htaccess is copied to dist before uploading
        const htaccessSourcePath = path.join(__dirname, '.htaccess');
        const htaccessDestPath = path.join(localBuildDir, '.htaccess');

        if (!fs.existsSync(htaccessDestPath)) {
            fs.copyFileSync(htaccessSourcePath, htaccessDestPath);
        }

        console.log('Uploading files...')
        const res = await client.uploadDir(localBuildDir, remoteBuildDir);
        console.log(res)

        // Upload the .htaccess file separately
        //await client.put(htaccessSourcePath, path.join(remoteBuildDir, '.htaccess'));
        //console.log('.htaccess file uploaded successfully');
    } catch (err) {
        console.error(err);
    } finally {
        client.end();
    }
};

// Ny funksjon for å spørre om opplasting
const askUpload = async () => {
    rl.question(`Vil du laste opp build til "${remoteBuildDir}"? [Y/n]:`, async (answer) => {
        if (answer === 'Y') {
            await uploadFiles(); // Kall uploadFiles hvis brukeren svarer ja
        } else {
            console.log('Upload canceled.');
        }

        rl.close();
    })


};

// Kjør spørsmålet etter byggingen
uploadFiles();