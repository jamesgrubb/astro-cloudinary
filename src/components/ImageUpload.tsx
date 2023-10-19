import React, { useState } from 'react';
import { Card, Text, Metric,Flex, ProgressBar } from "@tremor/react";

const per = (value:number) => value * 100
interface FaceData {
blur: number
}
const MyComponent: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>(null);
  const [faceData, setFaceData] = useState<any[] >([]);
  const [crop,setCrop] = useState<string >("")

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader: FileReader = new FileReader();
    //   fileReader.onload = (event: ProgressEvent<FileReader>) => {
    //     if (event.target) {
    //       setImgSrc(event.target.result);
    //     }
    //   };
      fileReader.readAsDataURL(e.target.files[0]);

      // Create a form and append the file input to it
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('upload_preset','astro-uploads')

    console.log(e.target.files[0])
      // You can add more fields to the form if needed, e.g., formData.append('key', 'value');

      // You can use fetch or any HTTP library to send the form data to the server
      // Here's an example using the fetch API:
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/makingthings/image/upload', {
          method: 'POST',
          body: formData,
        })
        
        

        // Handle the response as needed
        if (!response.ok) {
          console.error('File uploaded failed');
          // Reset the input field
          e.target.value = ''
          return
        } 

        const data = await response.json()

       

        console.log('File uploaded successfully', data?.info?.detection?.adv_face?.data[0])
        console.log('File uploaded successfully', data)
        setImgSrc(data.secure_url);
        setFaceData(data?.info?.detection?.adv_face?.data)
        

        const imageWidth = data.width;
        const imageHeight = data.height;
const { top, left, width, height } = data?.info?.detection?.adv_face?.data[0].bounding_box;

// Calculate the distance from the center to the edges of the bounding box
const topDistance = top;
const leftDistance = left;
const rightDistance = imageWidth - (left + width);
const bottomDistance = imageHeight - (top + height);

// Calculate the radius of the circular bounding box
const radius = Math.min(width, height) / 2;

// Set a margin for the circular bounding box (e.g., 20 pixels)
const margin = 20;

// Calculate the minimum distance from the center to the image edges
const minDistance = Math.min(topDistance, leftDistance, rightDistance, bottomDistance);

// Check if there is enough space for the circular bounding box
if (radius + margin <= minDistance) {
    console.log('There is enough space to crop the image with a circular bounding box.');
} else {
    console.log('Not enough space to crop the image with a circular bounding box.');
}

        e.target.value = ''

      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    }
  };

  return (
    <div>
        <label htmlFor="fileInput">Upload image</label>
      <input id="fileInput" type="file" onChange={handleOnChange} />
      {imgSrc && <img src={imgSrc as string} alt="Selected" />}
      {faceData.length && <pre><code>{JSON.stringify(faceData,null,2)}</code></pre>}
      {faceData.length ? faceData.map(data => {

     

console.log("value",data.attributes.blur.value)

          return(
            <Card>
            <Text>Blur</Text>
            <Metric>{data.attributes.blur.value * 100}%</Metric>
            <Flex className="mt-4">
          <Text>32% of annual target</Text>
          <Text>$ 225,000</Text>
        </Flex>
        <ProgressBar value={data.attributes.blur.value * 100} className="mt-2" />
        </Card>
          )
        }) : <Text >Waiting for image</Text>}
       
    
    </div>
  );
};

export default MyComponent;
