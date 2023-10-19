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
  ncol: number,               // Number of columns to display
  image_name_visible: boolean // show image name (boolean) default True
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
    nrow,               // Number of rows
    image_name_visible, // show image name (boolean) default True
  }: PythonArgs = args
  

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
  // State Image Modal
  const [isOpen, setIsOpen] = useState<boolean[]>(Array(nrow * ncol).fill(false));

  // >>> Event 1 >>>
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
  // >>> Event 2 >>>
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
  // >>> Event 3 >>>
  // モーダルを開く
  const handleOpen = (index: number) => {
    const updatedImageIsOpen: boolean[] = [...isOpen];
    updatedImageIsOpen[index] = true;
    setIsOpen(updatedImageIsOpen);
  };

  // モーダルを閉じる
  const handleClose = (index: number) => {
    const updatedImageIsOpen: boolean[] = [...isOpen];
    updatedImageIsOpen[index] = false;
    setIsOpen(updatedImageIsOpen);
  };
  
  // Hook >>>
  // Load images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(image_urls.map((imageUrl) => loadImage(imageUrl)));
      setImages(loadedImages as HTMLImageElement[]);
    };
    loadImages();
  }, [image_urls]);
  

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
      margin={3}
      >
        <SliderTrack bg='blue.100' >
          <SliderFilledTrack bg="blue.500" />
        </SliderTrack>
        <SliderThumb boxSize={3} bg="blue.500" >
          <Box color="blue.500"/>
        </SliderThumb>
      </Slider>

      <SimpleGrid columns={3} margin="0 20% 3% 20%">
        <Box>
          <Center>
            <Button onClick={handlePrevClick} colorScheme="messenger" fontFamily="Arial">Prev</Button>
          </Center>
        </Box>
        <Center>
          <Text margin={3} fontWeight="bold">{currentSetIndex+1}/{imageSets.length}</Text>
        </Center>
        <Box>
          <Center>
              <Button onClick={handleNextClick} colorScheme="messenger" fontFamily="Arial">Next</Button>
          </Center>
        </Box>
      </SimpleGrid>
      
      {image_name_visible ?(
        <SimpleGrid columns={ncol} spacing={2}>
            {images.length > 0 &&  // Only render if the images array is not empty
              imageSets[currentSetIndex].map((image, index) => (
                <VStack>
                  <Box 
                    width={imageSizeSets[currentSetIndex][index][0]}
                    >
                    <Center>
                      <Text margin="0 0 -1% 0" className="image_name" fontWeight="bold" fontFamily="Arial">{imageNameSets[currentSetIndex][index]}</Text>
                    </Center>
                  </Box>
                  <Center>
                    <Box 
                      width={imageSizeSets[currentSetIndex][index][0]} 
                      height={imageSizeSets[currentSetIndex][index][1]}
                      className={imageHoverClass}
                      margin="0 0 5% 0"
                      
                      >
                        <Stage width={imageSizeSets[currentSetIndex][index][0]} height={imageSizeSets[currentSetIndex][index][1]}>
                          <Layer>
                              <Image
                                image={image}
                                width={imageSizeSets[currentSetIndex][index][0]*0.98}
                                height={imageSizeSets[currentSetIndex][index][1]*0.98}
                                x={0}
                                y={0}
                                onClick={() => handleOpen(index)}
                              />
                          </Layer>
                        </Stage>
                        {isOpen[index] && (
                          <div onClick={() => handleClose(index)} className="modal-overlay">
                            <Box className="modal-content" width="100%" height="100%" bgColor="rgba(0, 0, 0, 0.5)">
                              <Center>
                                <img src={image.src} alt="画像" />
                              </Center>
                            </Box>
                          </div>
                        )}
                    </Box>
                  </Center>
                </VStack>
              ))}
          </SimpleGrid>
      ) : (
            <SimpleGrid columns={ncol} spacing={2}>
                {images.length > 0 &&  // Only render if the images array is not empty
                  imageSets[currentSetIndex].map((image, index) => (
                      <Center>
                        <Box 
                          width={imageSizeSets[currentSetIndex][index][0]} 
                          height={imageSizeSets[currentSetIndex][index][1]}
                          className={imageHoverClass}
                          margin="0 0 5% 0"
                          >
                            <Stage width={imageSizeSets[currentSetIndex][index][0]} height={imageSizeSets[currentSetIndex][index][1]}>
                              <Layer>
                                  <Image
                                    image={image}
                                    width={imageSizeSets[currentSetIndex][index][0]*0.98}
                                    height={imageSizeSets[currentSetIndex][index][1]*0.98}
                                    x={0}
                                    y={0}
                                    onClick={() => handleOpen(index)}
                                  />
                              </Layer>
                            </Stage>
                            {isOpen[index] && (
                              <div onClick={() => handleClose(index)} className="modal-overlay">
                                <Box className="modal-content" width="100%" height="100%" bgColor="rgba(0, 0, 0, 0.5)">
                                  <Center>
                                    <img src={image.src} alt="画像" />
                                  </Center>
                                </Box>
                              </div>
                            )}
                        </Box>
                      </Center>
                  ))}
              </SimpleGrid>
      )}
    </ChakraProvider>
  );
}
export default withStreamlitConnection(ImageViewer)
