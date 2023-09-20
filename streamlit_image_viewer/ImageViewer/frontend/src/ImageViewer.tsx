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

type TupleType = [number, number];
export interface PythonArgs {
  image_urls: string[],
  image_names: string[],
  image_size_list: TupleType[],
  nrow: number,
  ncol: number
}
const loadImage = async (url: string) => {
  return new Promise((resolve) => {
    const imageObj = new window.Image();
    imageObj.src = url;
    imageObj.onload = () => {
      resolve(imageObj);
    };
  });
};
const modifyImageSize = (current_image_size: number[], maxWidth: number, maxHeight: number) =>{
  // pythonから受け取ったsizeリストをmax sizeに合わせてリサイズ
  const currentWidth = current_image_size[0]
  const currentHeight = current_image_size[1]
  let newWidth = currentWidth;
  let newHeight = currentHeight;
  let imageType: string;

  // 縦横比に基づいて画像の種類を判別
  if (currentHeight >= currentWidth) {
    imageType = "heightType"; // 縦長の画像
  } else {
    imageType = "widthType"; // 横長の画像
  }

  // maxWidthに合わせて調整
  if (imageType === "widthType") {
    newWidth = maxWidth;
    newHeight = (currentHeight * maxWidth) / currentWidth;
  }

  // maxHeightに合わせて調整
  if (imageType === "heightType") {
    newHeight = maxHeight;
    newWidth = (currentWidth * maxHeight) / currentHeight;
  }
  // 新しい幅と高さを配列で返す
  return [newWidth, newHeight];
};

const ImageViewer = ({args}: ComponentProps) => {
  const {
    image_urls,
    image_size_list,
    image_names,
    ncol,
    nrow
  }: PythonArgs = args
  
  const params = new URLSearchParams(window.location.search);
  const baseUrl = params.get('streamlitUrl')
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [width, height] = useWindowSize();
  const maxWidth: number = width / ncol
  const maxHeight: number = maxWidth
  const imagesPerSet = ncol * nrow;
  const imageSets: HTMLImageElement[][] = [];
  const imageSizeSets: TupleType[][] = [];
  const imageNameSets: string[][] = [];
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const imageHoverClass = "image-hover";

  //　>>>配列の分割<<<  
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
  // >>> Event 1 <<<
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      // マウスホイールを下にスクロールした場合、次のセットを表示
      setCurrentSetIndex((prevIndex: number) =>
        prevIndex < imageSets.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.deltaY < 0) {
      // マウスホイールを上にスクロールした場合、前のセットを表示
      setCurrentSetIndex((prevIndex: number) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }
  };
  // >>> Event 2 <<<
  // Slider 用
  const handleChange = (newValue: number) => {
    setCurrentSetIndex(newValue);
  }

  // Prev Button用
  const handlePrevClick = () => {
    setCurrentSetIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };
  // Next Button用
  const handleNextClick = () => {
    setCurrentSetIndex((prevIndex) =>
      prevIndex < imageSets.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  // >>> Hook <<<
  // load images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(image_urls.map((imageUrl) => loadImage(baseUrl + imageUrl)));
      setImages(loadedImages as HTMLImageElement[]);
    };
    loadImages();
  }, [image_urls, baseUrl]);

  // resize canvas
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
          {images.length > 0 &&  // images 配列が非空の場合のみ描画
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