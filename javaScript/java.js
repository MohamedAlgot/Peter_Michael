document.addEventListener("DOMContentLoaded", () => {
    const featuredPropertiesGrid = document.querySelector("#featuredPropertiesGrid");
    const API = "https://edu-me01.github.io/Json-Data/Real-state.json";
    const fallbackImage = "no image"; 
    let allProperties = [];

    fetch(API)
        .then(response => {
            if (!response.ok) throw new Error("فشل تحميل البيانات");
            return response.json();
        })
        .then(data => {
            allProperties = data.properties;
            displayProperties(allProperties.slice(0, 12));
        })
        .catch(error => {
            featuredPropertiesGrid.innerHTML = '<p class="text-center text-danger">حدث خطأ أثناء تحميل العقارات.</p>';
            console.error(error);
        });

    // عرض العقارات
    function displayProperties(properties) {
        if (properties.length === 0) {
            featuredPropertiesGrid.innerHTML = '<p class="text-center text-muted">لا توجد نتائج مطابقة.</p>';
            return;
        }

        let output = "";
        properties.forEach(property => {
            const statusBadge = property.status === "For Sale"
                ? '<span class="badge bg-success position-absolute top-0 end-0 m-2">للبيع</span>'
                : property.status === "For Rent"
                    ? '<span class="badge bg-info position-absolute top-0 end-0 m-2">للإيجار</span>'
                    : "";

            const imageSrc = property.mainImage && property.mainImage !== ""
                ? property.mainImage
                : fallbackImage;

            output += `
            <div class="col-md-4">
                <div class="card card-img-top h-100 shadow-sm position-relative">
                    <img src="${imageSrc}" class="card-img-top" alt="${property.title}" onerror="this.src='${fallbackImage}'">
                    ${statusBadge}
                    <div class="card-body">
                        <h5 class="card-title">${property.title}</h5>
                        <p class="card-text text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i> ${property.location.city}, ${property.location.state}
                        </p>
                        <p class="fw-bold">${property.price} ${property.currency} ${property.status === "For Rent" ? "/شهر" : ""}</p>
                        <div class="d-flex justify-content-between">
                            <a href="serviceDetails.html?id=${property.id}" class="btn btn-outline-primary btn-sm">عرض التفاصيل</a>
                            <i class="fa-solid fa-heart"></i>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        featuredPropertiesGrid.innerHTML = output;
    }

    //search
    document.querySelector("#quickSearchForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const type = document.querySelector("#filterType").value.toLowerCase();
        const locationInput = document.querySelector("#filterLocation").value.trim().toLowerCase();
        const statusInput = document.querySelector("#filterStatus").value.toLowerCase();

        const filtered = allProperties.filter(property => {
            const propertyType = property.type?.toLowerCase();
            const propertyStatus = property.status?.toLowerCase();
            const propertyLocation = `${property.location?.city || ""} ${property.location?.state || ""}`.toLowerCase();

            return (
                (type === "" || propertyType === type) &&
                (locationInput === "" || propertyLocation.includes(locationInput)) &&
                (statusInput === "" || propertyStatus.replace(" ", "_") === statusInput)
            );
        });

        displayProperties(filtered);
    });
});