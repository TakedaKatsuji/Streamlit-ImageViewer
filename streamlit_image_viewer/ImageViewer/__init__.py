import os
import streamlit.components.v1 as components
from streamlit.components.v1.components import CustomComponent
import streamlit as st
from PIL import Image
from streamlit_image_viewer import IS_RELEASE
from pathlib import Path
import base64
import io

if IS_RELEASE:
    absolute_path = os.path.dirname(os.path.abspath(__file__))
    build_path = os.path.join(absolute_path, "frontend/build")
    _image_viewer_func = components.declare_component("st_imageviewer", path=build_path)
else:
    _image_viewer_func = components.declare_component("st_imageviewer", url="http://localhost:3000")
    
def _encode_image(image:Image) -> str:
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    encoded = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/jpeg;base64, {encoded}"
    
def image_viewer(image_path_list,ncol=2, nrow=2, image_name_visible=True, key=None) -> CustomComponent:
    image_url_list = []
    image_size_list = []
    image_name_list = []

    # Raise an error if ncol and nrow are not positive integers
    if not (isinstance(ncol, int) and ncol >= 1) or not (isinstance(nrow, int) and nrow >= 1):
        raise ValueError("Please specify ncol and nrow as positive integers greater than or equal to 1.")
    else:
        for image_path in image_path_list:
            image = Image.open(image_path)
            image_name = Path(image_path).name
            image_url = _encode_image(image=image)
            image_url_list.append(image_url)
            image_size_list.append(image.size)
            image_name_list.append(image_name)
            
        component_value = _image_viewer_func(
            image_urls=image_url_list,
            image_size_list=image_size_list,
            image_names=image_name_list,
            image_name_visible=image_name_visible,
            ncol=ncol, nrow=nrow,
            key=key)

    return component_value

if not IS_RELEASE:
    from glob import glob
    st.title("ImageViewer Demo Not Release")
    st.title("Sample Images")
    image_path_list = glob('../../image/*.jpg')
    image_path_list = sorted(image_path_list)
    image_viewer(image_path_list,3,2, image_name_visible=True)