import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="streamlit_image_viewer",
    version="0.1.1",
    author="katsuji takeda",
    description="streamlit components for image viewer",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/TakedaKatsuji/Streamlit-ImageViewer",
    packages=setuptools.find_packages(),
    include_package_data=True,
    keywords=['Python', 'Streamlit', 'React', 'TypeScript'],
    python_requires=">=3.9",
    install_requires=[
        "streamlit >= 1.14.0",
    ],
)