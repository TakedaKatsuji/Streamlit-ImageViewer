# Streamlit Image Viewer

Streamlit component for image viewer.

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://st-image-annotation.streamlit.app/)
[![PyPI](https://img.shields.io/pypi/v/streamlit-image-annotation)](https://pypi.org/project/streamlit-image-annotation/)
![](./image/demo.gif)
# Features
* You can easily view the images in a folder side by side
* Multiple rows and columns are supported
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
* **image_path_list** : A list containing the paths to the image files
* **ncol** : number of columns
* **nrow** : number of rows
* **key** : An optional string to use as the unique key for the widget. Assign a key so the component is not remount every time the script is rerun.

# References

* [**Streamlit-Image-Annotation**](https://github.com/hirune924/Streamlit-Image-Annotation/tree/master)  
* [**Streamlit Components Doc**](https://docs.streamlit.io/library/components)  
* [**streamlit-template**](https://github.com/streamlit/component-template)  
* Sample Images are downloaded from  [**Pixabay**](https://pixabay.com/ja/)