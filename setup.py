import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="streamlit_image_viewer",
    version="0.1.0",
    author="katsuji",
    description="streamlit components for image annotation",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    keywords=['Python', 'Streamlit', 'React', 'JavaScript'],
    python_requires=">=3.6",
    install_requires=[
        "streamlit >= 0.63",
    ],
)