import * as formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // parse form data using formidable, found in documentation
    const { fields, files } = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        keepExtensions: true
      });
      
      form.parse(req, (error, fields, files) => {
        if (error) {
            return reject(error);
        }
        
        resolve({ fields, files });
      });
    });

    // get the uploaded file
    const file = files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileObj = Array.isArray(file) ? file[0] : file;
    const filePath = fileObj.filepath || fileObj.path;
    
    if (!filePath) {
      return res.status(500).json({ error: 'File path is undefined' });
    }

    const pinataJWT = process.env.PINATA_JWT;

    if (!pinataJWT) {
      return res.status(500).json({ error: 'Server configuration error: Pinata JWT missing' });
    }

    // file upload to Pinata
    const formData = new FormData();
    const fileStream = fs.createReadStream(filePath);
    formData.append('file', fileStream, {
      filename: fileObj.originalFilename || 'file'
    });

    formData.append('network', 'public');
    formData.append('metadata', JSON.stringify({
      name: fileObj.originalFilename || 'file',
      keyvalues: {
        status: 'published'
      }
    }));
    
    formData.append('options', JSON.stringify({
      cidVersion: 1,
      visibility: 'PUBLIC',
      pinToIPFS: true
    }));

    try {
      const pinataResponse = await axios.post(
        'https://uploads.pinata.cloud/v3/files',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Authorization': `Bearer ${pinataJWT}`,
            ...formData.getHeaders()
          }
        }
      );

      const cid = pinataResponse.data.cid || 
                 (pinataResponse.data.data && pinataResponse.data.data.cid);

      if (!cid) {
        return res.status(500).json({
          error: 'No CID returned from Pinata'
        });
      }

      return res.status(200).json({ 
        success: true, 
        cid: cid
      });
    } catch (pinataError) {
      return res.status(500).json({ 
        error: 'Failed to upload to IPFS via Pinata', 
        details: pinataError.response?.data || pinataError.message 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to upload to IPFS', 
      details: error.message 
    });
  }
} 