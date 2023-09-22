from glob import glob
from streamlit_image_viewer import image_viewer
import streamlit_toggle as tog
import streamlit as st

st.set_page_config(layout="wide")

image_path_list = glob('../../image/*.jpg') + glob('../../image/*.png') 
image_path_list = sorted(image_path_list)

if "ncol" not in st.session_state:
        st.session_state.ncol = 2
if "nrow" not in st.session_state:
    st.session_state.nrow = 2

col1, col2, _ = st.columns([0.1,0.2,0.2])

with col1:
    # ----- settings -----
    st.markdown("## :gear: **Settings**")
    st.number_input("**number of columns**", min_value=1, step=1, key="ncol")
    st.number_input("**number of rows**", min_value=1, step=1,key="nrow")
    is_visible_image_name = tog.st_toggle_switch(label="Show Image Names", 
        key="is_visible_image_name", 
        default_value=True, 
        label_after = False, 
        inactive_color = '#D3D3D3', 
        active_color="#11567f", 
        track_color="#29B5E8"
        )
with col2:
    st.title("ImageViewer App")
    image_viewer(
        image_path_list,
        ncol=st.session_state.ncol,
        nrow=st.session_state.nrow,
        image_name_visible=is_visible_image_name,
        key="image_viewer")