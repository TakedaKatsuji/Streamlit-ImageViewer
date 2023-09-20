from glob import glob
from streamlit_image_viewer import image_viewer
import streamlit as st

st.title("ImageViewer App")
st.title("Sample Images")
image_path_list = glob('../../image/*.jpg') + glob('../../image/*.png') 
image_path_list = sorted(image_path_list)
image_viewer(image_path_list, ncol=2, nrow=2, key="image_viewer")