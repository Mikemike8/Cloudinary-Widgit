import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

(async function() {
  cloudinary.config({ 
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

     
  try {
    const uploadResult = await cloudinary.uploader.upload(
      'https://image.slidesharecdn.com/pdftestfile-140527184544-phpapp02/95/pdf-test-file-2-638.jpg?cb=1401216363',
      {         public_id: 'my_pdf_file',
        resource_type: 'raw' }
    );
    console.log(uploadResult);

    const optimizeUrl = cloudinary.url('my_pdf_file', {
      fetch_format: 'auto',
      quality: 'auto'
    });
    console.log(optimizeUrl);

    const autoCropUrl = cloudinary.url('my_pdf_file', {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500
    });
    console.log(autoCropUrl);
  } catch (error) {
    console.error(error);
  }
})();
