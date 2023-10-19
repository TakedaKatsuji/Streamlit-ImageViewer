from glob import glob
from streamlit_image_viewer import image_viewer
import streamlit_toggle as tog
import streamlit as st

st.set_page_config(layout="wide")

image_path_list = glob('../../image/*.jpg') + glob('../../image/*.png') 

st.title("MultiPage App")

setting_col, viewer_col, _ = st.columns([2,4,2])
with setting_col:
    st.markdown("## :gear: Setting")
    n_col = st.number_input("n_col", min_value=1, max_value=5, value=3)
    n_raw = st.number_input("n_raw", min_value=1, max_value=5, value=2)
    is_visible_image_name = tog.st_toggle_switch(label="Show Image Names", 
        key="is_visible_image_name", 
        default_value=True, 
        label_after = False, 
        inactive_color = '#D3D3D3', 
        active_color="#11567f", 
        track_color="#29B5E8"
        )
    
with viewer_col:
    st.markdown("## :camera: Viewer")
    image_viewer(
        image_path_list,
        ncol=n_col,
        nrow=n_raw,
        image_name_visible=is_visible_image_name,
        key="image_viewer")
