# Streamlit Image Viewer

Streamlit component for image viewer.

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://st-image-annotation.streamlit.app/)
[![PyPI](https://img.shields.io/pypi/v/streamlit-image-annotation)](https://pypi.org/project/streamlit-image-annotation/)
![](./image/demo.gif)
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
# API
```python
image_viewer(
    image_path_list: List[str],
    ncol: int = 2,
    nrow: int = 2,
    key: Optional[str] = None
)
```
* **image_path_list** : A list containing paths to the images to be displayed.
* **ncol** : The number of columns. Defaults to 2.
* **nrow** : The number of rows. Defaults to 2.
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
* 2023/9/20 Release version 0.1.6
* 2023/9/22 Release version 0.1.9
* 2023/9/22 Release version 0.2.0 Add Modal Image and image name visible/invisible