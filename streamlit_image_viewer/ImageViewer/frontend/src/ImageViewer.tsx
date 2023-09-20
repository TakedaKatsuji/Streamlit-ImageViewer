import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps
} from "streamlit-component-lib"
import React, { useEffect, useState} from "react"
import { 
  ChakraProvider, 
  Box, 
  Center, 
  Text, 
  SimpleGrid, 
  VStack, 
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,

} from '@chakra-ui/react'

import { Stage, Image, Layer } from 'react-konva';
import useWindowSize from "./useWindowSize";

// Define a tuple type representing an array of two numbers.
type TupleType = [number, number];

// Define an interface named PythonArgs to specify the types of arguments received from Python.
export interface PythonArgs {
  image_urls: string[],        // Array of image URLs
  image_names: string[],      // Array of image names
  image_size_list: TupleType[], // Array of image sizes (width and height tuples)
  nrow: number,               // Number of rows to display
  ncol: number                // Number of columns to display
}

// Define a function to asynchronously load an image.
const loadImage = async (url: string) => {
  return new Promise((resolve) => {
    const imageObj = new window.Image();
    imageObj.src = url;
    imageObj.onload = () => {
      resolve(imageObj);
    };
  });
};

// Define a function to modify image size based on the maximum dimensions.
const modifyImageSize = (current_image_size: number[], maxWidth: number, maxHeight: number) =>{
  // Resize the size list received from Python to fit the max size
  const currentWidth = current_image_size[0]
  const currentHeight = current_image_size[1]
  let newWidth = currentWidth;
  let newHeight = currentHeight;
  let imageType: string;

  // Determine the image type based on aspect ratio
  if (currentHeight >= currentWidth) {
    imageType = "heightType"; // Portrait-oriented image
  } else {
    imageType = "widthType"; // Landscape-oriented image
  }

  // Adjust for maxWidth
  if (imageType === "widthType") {
    newWidth = maxWidth;
    newHeight = (currentHeight * maxWidth) / currentWidth;
  }

  // Adjust for maxHeight
  if (imageType === "heightType") {
    newHeight = maxHeight;
    newWidth = (currentWidth * maxHeight) / currentHeight;
  }
  // Return the new width and height as an array
  return [newWidth, newHeight];
};

const ImageViewer = ({ args }: ComponentProps) => {
  // Extract necessary properties from the component's arguments
  const {
    image_urls,        // Array of image URLs
    image_size_list,   // Array of image sizes (width and height tuples)
    image_names,       // Array of image names
    ncol,              // Number of columns
    nrow               // Number of rows
  }: PythonArgs = args
  
  // Get the 'streamlitUrl' from URL parameters and store it in baseUrl
  const params = new URLSearchParams(window.location.search);
  const baseUrl = params.get('streamlitUrl')

  // State variable to store images
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Get the width and height of the window
  const [width, height] = useWindowSize();

  // Calculate the maximum width and height for images
  const maxWidth: number = width / ncol
  const maxHeight: number = maxWidth

  // Number of images per set
  const imagesPerSet = ncol * nrow;

  // Arrays to store image sets, image size sets, and image name sets
  const imageSets: HTMLImageElement[][] = [];
  const imageSizeSets: TupleType[][] = [];
  const imageNameSets: string[][] = [];

  // State variable to store the current set index
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);

  // Class name for image hover effect
  const imageHoverClass = "image-hover";
  
  // Splitting arrays >>>
  for (let i = 0; i < images.length; i += imagesPerSet) {
    imageSets.push(images.slice(i, i + imagesPerSet));
  }

  for (let i = 0; i < image_names.length; i += imagesPerSet) {
    imageNameSets.push(image_names.slice(i, i + imagesPerSet));
  }
    
  const image_size_list_resized: TupleType[] = image_size_list.map((imageSize) => {
    const [currentWidth, currentHeight] = imageSize;
    const [newWidth, newHeight] = modifyImageSize([currentWidth, currentHeight], maxWidth, maxHeight);
    return [newWidth, newHeight];
  });

  for (let i = 0; i < image_size_list_resized.length; i += imagesPerSet) {
    imageSizeSets.push(image_size_list_resized.slice(i, i + imagesPerSet));
  }
  // Event 1 >>>
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      // When scrolling down with the mouse wheel, display the next set
      setCurrentSetIndex((prevIndex: number) =>
        prevIndex < imageSets.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.deltaY < 0) {
      // When scrolling up with the mouse wheel, display the previous set
      setCurrentSetIndex((prevIndex: number) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }
  };
  // Event 2 >>>
  // For the Slider
  const handleChange = (newValue: number) => {
    setCurrentSetIndex(newValue);
  }

  // For the Prev button
  const handlePrevClick = () => {
    setCurrentSetIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };
  // For the Next button
  const handleNextClick = () => {
    setCurrentSetIndex((prevIndex) =>
      prevIndex < imageSets.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  // Hook >>>
  // Load images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(image_urls.map((imageUrl) => loadImage(baseUrl + imageUrl)));
      setImages(loadedImages as HTMLImageElement[]);
    };
    loadImages();
  }, [image_urls, baseUrl]);

  // Resize canvas
  useEffect(() => {
    const resizeCanvas = () => {
      Streamlit.setFrameHeight()
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas()
  }, [currentSetIndex])

  return (
    <ChakraProvider>
      <Slider
      aria-label="Image Set Slider"
      value={currentSetIndex}
      min={0}
      max={imageSets.length - 1}
      step={1}
      onChange={handleChange}
      >
        <SliderTrack bg='blue.100'>
          <SliderFilledTrack bg="blue.500" />
        </SliderTrack>
        <SliderThumb boxSize={5} bg="blue.500" >
          <Box color="blue.500"/>
        </SliderThumb>
      </Slider>

      <SimpleGrid columns={2}>
        <Box>
          <Center>
            <Button onClick={handlePrevClick} colorScheme="messenger">Prev</Button>
          </Center>
        </Box>
        <Box>
          <Center>
              <Button onClick={handleNextClick} colorScheme="messenger" >Next</Button>
          </Center>
        </Box>
      </SimpleGrid>
      <Center>
        <Text>{currentSetIndex+1}/{imageSets.length}</Text>
      </Center>

      <SimpleGrid columns={ncol} spacing={2}>
          {images.length > 0 &&  // Only render if the images array is not empty
            imageSets[currentSetIndex].map((image, index) => (
              <VStack>
                <Box 
                  width={imageSizeSets[currentSetIndex][index][0]} 
                  >
                  <Center>
                    <Text>{imageNameSets[currentSetIndex][index]}</Text>
                  </Center>
                </Box>
                <Center>
                  <Box 
                    width={imageSizeSets[currentSetIndex][index][0]} 
                    height={imageSizeSets[currentSetIndex][index][1]}
                    className={imageHoverClass}
                    >
                      <Stage width={imageSizeSets[currentSetIndex][index][0]} height={imageSizeSets[currentSetIndex][index][1]}>
                        <Layer>
                            <Image
                              image={image}
                              width={imageSizeSets[currentSetIndex][index][0]*0.99}
                              height={imageSizeSets[currentSetIndex][index][1]*0.99}
                              x={0}
                              y={0}
                            />
                        </Layer>
                      </Stage>
                  </Box>
                </Center>
              </VStack>
            ))}
        </SimpleGrid>
    </ChakraProvider>
  );
}
export default withStreamlitConnection(ImageViewer)
