# Streamlit Image Viewer

Streamlit component for image viewer.

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

[![PyPI](https://img.shields.io/pypi/v/streamlit-image-viewer)](https://pypi.org/project/streamlit-image-viewer/)
[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://st-image-annotation.streamlit.app/)

<p style="font-size: 24px;"><a href="https://imageviewer.streamlit.app/">🔥Demo APP🔥</a></p>

<img src=demo/demo.gif></img>
# Features
* You can easily view the images in a folder side by side
* Support for displaying images in multiple rows and columns

# Install
```sh
pip install streamlit-image-viewer
```

# Example Usage
```python
from glob import glob
from streamlit_image_viewer import image_viewer
import streamlit as st

st.title("ImageViewer App")
st.title("Sample Images")
image_path_list = glob('../../image/*.jpg') + glob('../../image/*.png') 
image_viewer(image_path_list, ncol=3, nrow=2, key="image_viewer")
```
# Example App
```shell
cd streamlit_image_viewer/ImageViewer
streamlit run app.py
```
# API
```python
image_viewer(
    image_path_list: List[str],
    ncol: int = 2,
    nrow: int = 2,
    image_name_visible: bool = True
    key: Optional[str] = None
)
```
* **image_path_list** : A list containing paths to the images to be displayed.
* **ncol** : The number of columns. Defaults to 2.
* **nrow** : The number of rows. Defaults to 2.
* **image_name_visible** : A boolean indicating whether image names are visible.
* **key** : A unique key for the component. Can be used to distinguish between different components.

## NOTE
* `ncol` and `nrow` should be positive integers; otherwise, a ValueError will be raised.  
This function allows for the effective display of specified images in a grid layout with a customizable number of columns and rows. By default, a 2x2 grid is created, but you can adjust the column and row counts to suit your needs.

# References

* [**Streamlit-Image-Annotation**](https://github.com/hirune924/Streamlit-Image-Annotation/tree/master)  
* [**Streamlit Components Doc**](https://docs.streamlit.io/library/components)  
* [**streamlit-template**](https://github.com/streamlit/component-template)  
* Sample Images are downloaded from  [**Pixabay**](https://pixabay.com/ja/)

# Release note
* 2023/10/19 Release version 0.2.5 Now available for Multi-Page
* 2023/9/22 Release version 0.2.2 Add Modal Image and image name visible/invisible
* 2023/9/22 Release version 0.1.9
* 2023/9/20 Release version 0.1.6