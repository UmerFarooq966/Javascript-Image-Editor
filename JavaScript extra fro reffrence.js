<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        // Get the drop area and file input elements
        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('file-input');

        // Handle drag and drop events
        dropArea.addEventListener('dragover', handleDragOver);
        dropArea.addEventListener('drop', handleDrop);

        // Handle file selection from the file input
        fileInput.addEventListener('change', handleFileSelect);

        // Function to handle the dragover event
        function handleDragOver(event) {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'copy';
        }

        // Function to handle the drop event
        function handleDrop(event) {
            event.preventDefault();
            event.stopPropagation();

            const file = event.dataTransfer.files[0];
            processImage(file);
        }

        // Function to handle the file input change event
        function handleFileSelect(event) {
            const file = event.target.files[0];
            processImage(file);
        }

        // Function to process the uploaded image
        function processImage(file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const imageUrl = event.target.result;
                imagePreview.src = imageUrl;
            };

            reader.readAsDataURL(file);
        }

        // Get the image element
        const imagePreview = document.getElementById('image-preview');

        // Get the sliders
        const contrastSlider = document.getElementById('contrast-slider');
        const hueSlider = document.getElementById('hue-slider');
        const brightnessSlider = document.getElementById('brightness-slider');
        const saturationSlider = document.getElementById('saturation-slider');
        const invertSlider = document.getElementById('invert-slider');
        const sepiaSlider = document.getElementById('sepia-slider');
        const blurSlider = document.getElementById('blur-slider');
        const cropSlider = document.getElementById('crop-slider');
        const rotateSlider = document.getElementById('rotate-slider');
        const sideCropSlider = document.getElementById('side-crop-slider');

        // Get the value elements
        const contrastValue = document.getElementById('contrast-value');
        const hueValue = document.getElementById('hue-value');
        const brightnessValue = document.getElementById('brightness-value');
        const saturationValue = document.getElementById('saturation-value');
        const invertValue = document.getElementById('invert-value');
        const sepiaValue = document.getElementById('sepia-value');
        const blurValue = document.getElementById('blur-value');
        const cropValue = document.getElementById('crop-value');
        const rotateValue = document.getElementById('rotate-value');
        const sideCropValue = document.getElementById('side-crop-value');

        // Update the image based on slider values
        const updateImage = () => {
            const contrast = contrastSlider.value;
            const hue = hueSlider.value;
            const brightness = brightnessSlider.value;
            const saturation = saturationSlider.value;
            const invert = invertSlider.value;
            const sepia = sepiaSlider.value;
            const blur = blurSlider.value;
            const crop = cropSlider.value;
            const sideCrop = sideCropSlider.value;
            const rotate = rotateSlider.value;

            contrastValue.textContent = `Contrast: ${contrast}`;
            hueValue.textContent = `Hue: ${hue}`;
            brightnessValue.textContent = `Brightness: ${brightness}`;
            saturationValue.textContent = `Saturation: ${saturation}`;
            invertValue.textContent = `Invert: ${invert}`;
            sepiaValue.textContent = `Sepia: ${sepia}`;
            blurValue.textContent = `Blur: ${blur}`;
            cropValue.textContent = `Crop: ${crop}°`;
            sideCropValue.textContent = `Crop from Sides: ${sideCrop}%`;
            rotateValue.textContent = `Rotate: ${rotate}°`;

            const cropPercentage = crop / 100;
            const sideCropPercentage = sideCrop / 100;
            const cropTop = cropPercentage * 50;
            const cropBottom = 100 - cropPercentage * 50;
            const sideCropLeft = sideCropPercentage * 50;
            const sideCropRight = 100 - sideCropPercentage * 50;

            imagePreview.style.filter = `contrast(${contrast}%) hue-rotate(${hue}deg) brightness(${brightness}%) saturate(${saturation}%) invert(${invert}%) sepia(${sepia}%) blur(${blur}px)`;
            imagePreview.style.transform = `rotate(${rotate}deg)`;
            imagePreview.style.clipPath = `polygon(${sideCropLeft}% ${cropTop}%, ${sideCropRight}% ${cropTop}%, ${sideCropRight}% ${cropBottom}%, ${sideCropLeft}% ${cropBottom}%)`;
        };

        // Add event listeners to sliders
        contrastSlider.addEventListener('input', updateImage);
        hueSlider.addEventListener('input', updateImage);
        brightnessSlider.addEventListener('input', updateImage);
        saturationSlider.addEventListener('input', updateImage);
        invertSlider.addEventListener('input', updateImage);
        sepiaSlider.addEventListener('input', updateImage);
        blurSlider.addEventListener('input', updateImage);
        cropSlider.addEventListener('input', updateImage);
        sideCropSlider.addEventListener('input', updateImage);
        rotateSlider.addEventListener('input', updateImage);

        // Apply Super Resolution API
        const applySuperResolutionApi = () => {
            const loadingIndicator = document.getElementById('loading-indicator');
            loadingIndicator.style.display = 'block';
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = imagePreview.naturalWidth;
            canvas.height = imagePreview.naturalHeight;
            context.filter = imagePreview.style.filter;
            context.drawImage(imagePreview, 0, 0);
            canvas.toBlob((blob) => {
                const form = new FormData();
                form.append('image_file', blob);
                form.append('upscale', 2);

                fetch('https://clipdrop-api.co/super-resolution/v1', {
                    method: 'POST',
                    headers: {
                        'x-api-key': 'xxxxx Your API Key',
                    },
                    body: form,
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.blob();
                        } else if (response.status === 400) {
                            showFlashMessage('Request is malformed or incomplete or Image Res is too big.');
                            throw new Error('Bad Request');
                        } else {
                            throw new Error('Error occurred during API call.');
                        }
                    })
                    .then((blob) => {
                        // Download the edited image
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'edited_image.jpg'; // Set the desired file name
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            });
        };

        // Add event listener to Super Resolution API button
        const superResolutionApiButton = document.getElementById('super-resolution-api-button');
        superResolutionApiButton.addEventListener('click', applySuperResolutionApi);

        // Apply Background Removal API
        // Apply Background Removal API
        const applyBackgroundRemovalApi = () => {
            const loadingIndicator = document.getElementById('loading-indicator');
            loadingIndicator.style.display = 'block';
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = imagePreview.naturalWidth;
            canvas.height = imagePreview.naturalHeight;
            context.filter = imagePreview.style.filter;
            context.drawImage(imagePreview, 0, 0);
            canvas.toBlob((blob) => {
                const form = new FormData();
                form.append('image_file', blob);

                fetch('https://clipdrop-api.co/remove-background/v1', {
                    method: 'POST',
                    headers: {
                        'x-api-key': 'xxxxx Your API Key',
                    },
                    body: form,
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.arrayBuffer();
                        } else if (response.status === 400) {
                            showFlashMessage('Request is malformed or incomplete or Image Res is too big.');
                            throw new Error('Bad Request');
                        } else {
                            throw new Error('Error occurred during API call.');
                        }
                    })
                    .then((buffer) => {
                        // buffer here is a binary representation of the returned image
                        // Handle the buffer as needed
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            });
        };

// Add event listener to Background Removal API button
        const backgroundRemovalApiButton = document.getElementById('background-removal-api-button');
        backgroundRemovalApiButton.addEventListener('click', applyBackgroundRemovalApi);


        // Download edited image
        const downloadButton = document.getElementById('download-button');
        downloadButton.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = imagePreview.naturalWidth;
            canvas.height = imagePreview.naturalHeight;
            context.filter = imagePreview.style.filter;
            context.drawImage(imagePreview, 0, 0);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'edited_image.jpg';
            link.click();
        });
    });
</script>