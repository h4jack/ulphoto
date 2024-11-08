const file_input = document.querySelector(".file_upload_input");
const file_name_message = document.querySelector(".file-name-message");
const image_view = document.querySelector(".image_view");

document.querySelector(".image-output").addEventListener("click", () => {
    navigator.clipboard.writeText(document.querySelector(".file-url").href);
})

async function uploadImage(imageData) {
    const url = "https://api.imgbb.com/1/upload?expiration=600&key=b01f38496c2d894da1a3bda80692d982";

    // Create a FormData object
    const formData = new FormData();
    formData.append("image", imageData); // Append the image data

    try {
        // Send the POST request using fetch
        const response = await fetch(url, {
            method: "POST",
            body: formData // Attach the FormData object
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const result = await response.json();
        document.querySelector(".image-output").style.display = "flex";
        document.querySelector(".file-url").textContent = result.data.display_url;
        document.querySelector(".file-url").href = result.data.display_url;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

function uploadClicked() {
    const file = file_input.files[0];
    if (file) {
        uploadImage(file);
    }
}

file_input.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the selected file (first file if multiple are selected)
    if (file && file.size > 10000000) { // Check if file size exceeds 5MB
        file_name_message.textContent = `File size is too large please select a file under 10MB. your file size is ${(file.size / 1000000).toFixed(2)}MB`;
        return;
    }
    if (file) {
        file_name_message.textContent = file.name;
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = function (e) {
            // Set the background image to the data URL of the file
            image_view.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});