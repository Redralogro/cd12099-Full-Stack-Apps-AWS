import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import {isUri}  from 'valid-url';



(async ()=>{
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Endpoint to filter an image from a public URL
  app.get('/filteredimage', async (req, res) => {
    const { image_url } = req.query;

    // 1. Validate the image_url query
    if (!image_url) {
      return res.status(400).send({ message: 'image_url is required' });
    }
    if(!isUri(image_url)){
      return res.status(422).send({ message: 'Not a valid URL' });
    }
    
    try {
      // 2. Call filterImageFromURL(image_url) to filter the image
      const filteredPath = await filterImageFromURL(image_url);
      // 3. Send the resulting file in the response
      res.sendFile(filteredPath, async (err) => {
        if (err) {
          console.error("Error sending file:", err);
        } else {
          // 4. Delete any files on the server after response is sent
          await deleteLocalFiles([filteredPath]);
        }
      });
    } catch (error) {
      res.status(500).send({ message: `Error processing image: ${error}` });
    }
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );

})();