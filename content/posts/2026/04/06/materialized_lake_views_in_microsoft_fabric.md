---
title: " Microsoft Fabric Materialized Lake Views"
title_en: "Microsoft Fabric Materialized Lake Views"
date: "2026-04-06"
excerpt: "Vũ Khí Bí Mật - Để Xây Dựng Pipeline Dữ Liệu Tự Động Và Hiệu Suất Cao"
excerpt_en: "The Secret Weapon - for Automated, High-Performance Data Pipelines"
author: "Triet"
tags: ["Microsoft Fabric", "Data", "Lakehouse"]
tags_en: ["Microsoft Fabric", "Data", "Lakehouse"]
---

# Microsoft Fabric Materialized Lake Views: "Vũ Khí Bí Mật" Để Xây Dựng Pipeline Dữ Liệu Tự Động Và Hiệu Suất Cao

### 1. Lời mở đầu: Bài toán về sự cân bằng giữa Tốc độ và Độ tươi mới của Dữ liệu

Trong vai trò là những người dẫn dắt chiến lược dữ liệu, chúng ta thường xuyên đối mặt với một "nghịch lý" kinh điển: **Sự đánh đổi giữa tính linh hoạt và hiệu suất.** * Một bên là **Virtual Views (View ảo)**: Cực kỳ linh hoạt nhưng lại "ngốn" rất nhiều tài nguyên tính toán (Compute) mỗi khi thực hiện truy vấn. Điều này không chỉ dẫn đến chi phí Capacity khó kiểm soát mà còn khiến trải nghiệm người dùng cuối trở nên chậm chạp.
* Bên còn lại là **Physical Tables (Bảng vật lý)**: Truy vấn cực nhanh vì dữ liệu đã có sẵn. Tuy nhiên, nó lại tạo ra một gánh nặng vận hành khổng lồ. Đội ngũ kỹ sư phải tiêu tốn hàng giờ để xây dựng hệ thống điều phối (Orchestration) phức tạp và xử lý các lỗi thủ công phát sinh.

Câu hỏi đặt ra cho các nhà lãnh đạo dữ liệu là: Liệu có giải pháp nào cho phép chúng ta chỉ cần "tuyên bố" logic kinh doanh và để nền tảng tự động hóa toàn bộ phần "hạ tầng đường ống" (plumbing), đồng thời đảm bảo tốc độ truy vấn ở mức tối ưu? 

Câu trả lời chính là **Materialized Lake Views (MLVs)** – một cuộc cách mạng về kiến trúc dữ liệu trong hệ sinh thái Microsoft Fabric.

---

### 2. Takeaway 1: Materialized Lake Views (MLVs) – Định nghĩa lại khái niệm "Declarative Pipeline"

Materialized Lake Views không đơn thuần là một "view" thông thường. Bạn hãy tưởng tượng nó như một cấu trúc dữ liệu lai (hybrid), kết hợp hoàn hảo giữa tính trừu tượng của SQL View và sức mạnh lưu trữ vật lý của Delta Lake trên OneLake.

Khác với các hệ quản trị CSDL truyền thống, MLVs trong Fabric được quản lý tự động hoàn toàn bởi bộ máy Spark. Các đặc tính cốt lõi bao gồm:

* **Lưu trữ vật lý (Native Storage):** Kết quả được lưu trực tiếp thành các file Delta/Parquet chuẩn hóa. Điều này cho phép các bộ máy khác như Spark, T-SQL hay Power BI truy cập trực tiếp mà không cần sao chép dữ liệu đi đâu cả.
* **Mô hình tuyên bố (Declarative):** Các kỹ sư chỉ cần định nghĩa "kết quả tôi muốn thấy" bằng ngôn ngữ SQL quen thuộc. Fabric sẽ tự động lo phần còn lại: làm thế nào để dữ liệu luôn tươi mới (Freshness).
* **Quản lý đồ thị phụ thuộc (DAG):** Nền tảng tự động nhận diện dòng chảy dữ liệu (Lineage). Khi bảng nguồn thay đổi, các MLV ở tầng sau sẽ tự động cập nhật theo đúng thứ tự logic mà bạn không cần phải viết một dòng code điều phối nào.

> *“Materialized Lake Views giúp doanh nghiệp dịch chuyển từ việc 'xây dựng và duy trì đường ống' sang việc 'tạo ra tài sản dữ liệu sẵn sàng truy vấn'. Đây là chìa khóa để giảm thiểu tổng chi phí sở hữu (TCO) và tăng tốc giá trị kinh doanh.”*

---

### 3. Takeaway 2: Cơ chế "Optimal Refresh" – Thông minh hơn, Tiết kiệm hơn

Sức mạnh thực sự của MLV nằm ở bộ máy **Optimal Refresh**. Thay vì tiêu tốn tài nguyên Capacity để chạy lại toàn bộ dữ liệu (Full Refresh) một cách lãng phí, Fabric sẽ thông minh phân tích các thay đổi trong Delta Log của bảng nguồn để chọn chiến lược tối ưu nhất:

| Chiến lược làm mới | Điều kiện kích hoạt | Tác động TCO & Hiệu suất |
| :--- | :--- | :--- |
| **No Refresh (Skip)** | Không có thay đổi mới trong Delta log nguồn. | Tiết kiệm 100% tài nguyên tính toán. |
| **Incremental Refresh** | Chỉ dành cho dữ liệu thêm mới (Append-only) và đã bật Change Data Feed (CDF). | Chỉ xử lý bản ghi mới, cực kỳ hiệu quả cho dữ liệu lớn. |
| **Full Refresh** | Có logic không xác định, bảng nguồn có Update/Delete, hoặc tập dữ liệu quá nhỏ. | Đảm bảo tính chính xác tuyệt đối của dữ liệu. |

**Lưu ý quan trọng cho Kiến trúc sư:** Hệ thống sẽ tự động chuyển về Full Refresh nếu chi phí tính toán Incremental lớn hơn Full Refresh (thường xảy ra với các tập dữ liệu nhỏ). Để kích hoạt cơ chế làm mới tăng trưởng (Incremental), bạn bắt buộc phải bật thuộc tính `delta.enableChangeDataFeed = true` trên các bảng nguồn. Nếu bảng nguồn có các thao tác DELETE hoặc UPDATE, cơ chế Incremental sẽ không khả dụng.

---

### 4. Takeaway 3: Kiểm soát chất lượng dữ liệu ngay tại điểm tính toán

MLV không chỉ là nơi biến đổi dữ liệu; nó còn đóng vai trò là một "trạm kiểm soát" chất lượng thông minh thông qua các ràng buộc SQL (SQL Constraints). Việc nhúng các luật chất lượng trực tiếp vào view giúp ngăn chặn "dữ liệu rác" xâm nhập vào tầng Gold ngay từ khi dữ liệu được vật lý hóa.

Hai chiến lược kiểm soát cốt lõi bạn có thể áp dụng:

1. **ON MISMATCH DROP:** Tự động loại bỏ các bản ghi vi phạm (ví dụ: đơn giá âm, thiếu ID khách hàng). Đây là giải pháp hoàn hảo để "lọc sạch" dữ liệu ở tầng Silver.
2. **ON MISMATCH FAIL:** Dừng toàn bộ pipeline và báo lỗi nếu phát hiện vi phạm nghiêm trọng (ví dụ: tổng doanh thu không cân bằng). Đây là "chốt chặn" bắt buộc cho các báo cáo tài chính quan trọng ở tầng Gold.

**Kỹ thuật chuyên sâu:** Các cột được sử dụng trong câu lệnh `CONSTRAINT` bắt buộc phải có mặt trong câu lệnh `SELECT`. Nếu không, hệ thống sẽ báo lỗi ngay lập tức.

---

### 5. Takeaway 4: MLVs & Power BI Direct Lake – Chấm dứt nỗi lo "Fallback"

Đối với các dự án phân tích quy mô lớn, việc duy trì chế độ **Direct Lake** trong Power BI là mục tiêu tối thượng để đạt hiệu suất cao nhất. Các Standard Views (View ảo) thường khiến Power BI phải chuyển sang chế độ DirectQuery (gọi là Fallback), dẫn đến độ trễ cao và làm nghẽn hệ thống khi có nhiều người truy cập.

MLVs giải quyết triệt để vấn đề này vì:

* **Duy trì hiệu suất VertiPaq:** Vì MLV là các file Delta vật lý, bộ máy VertiPaq của Power BI có thể nạp trực tiếp vào bộ nhớ. Tốc độ sẽ tương đương với chế độ Import nhưng dữ liệu lại luôn được cập nhật mới nhất.
* **Khả năng mở rộng (Scalability):** MLV giúp giữ dữ liệu trong bộ nhớ, giảm tải tối đa cho các máy chủ tính toán, đảm bảo trải nghiệm mượt mà bất kể số lượng người dùng tăng lên.
* **Tối ưu hóa lưu trữ:** Để đạt hiệu suất đỉnh cao, khuyến nghị tối ưu hóa các file Parquet của MLV đạt mục tiêu khoảng 400MB mỗi file (tương đương khoảng 2 triệu dòng dữ liệu).

---

### 6. Hướng dẫn thực hành: Triển khai Medallion Architecture với AdventureWorks

Hãy cùng thử xây dựng tầng dữ liệu trong 10 phút với bộ dữ liệu mẫu AdventureWorks:

1. **Thiết lập môi trường:** Khởi tạo một Lakehouse đã bật tính năng Schema (đây là điều kiện tiên quyết).
2. **Chuẩn bị tầng Bronze (Thô):** Nạp các bảng thô như `SalesOrderHeader`, `Address`, `CreditCard`. Đừng quên bật CDF bằng lệnh:  
   `ALTER TABLE adventureworks_bronze.salesorderheader SET TBLPROPERTIES (delta.enableChangeDataFeed = true)`.
3. **Tầng Silver (MLV - Làm sạch):** Tạo MLV để kết hợp `Address` với `StateProvince` nhằm lấy tên vùng miền đầy đủ. Thiết lập `ON MISMATCH FAIL` để chặn các địa chỉ không có mã vùng.
4. **Tầng Gold (MLV - Tổng hợp):** Tạo bảng tổng hợp doanh thu theo vùng. Sử dụng `ON MISMATCH DROP` để loại bỏ các giao dịch thiếu thông tin thẻ tín dụng.
5. **Vận hành:** Thiết lập lịch trình (Schedule) trong Lakehouse. Fabric sẽ tự động theo dõi toàn bộ tiến trình qua Lineage View.

**Kịch bản thực tế:** Nếu dữ liệu nguồn ở tầng Bronze bị lỗi (ví dụ: mã vùng bị sai), MLV ở tầng Silver với ràng buộc `FAIL` sẽ dừng pipeline ngay lập tức. Điều này ngăn chặn việc đưa dữ liệu sai lên báo cáo lãnh đạo và giúp các kỹ sư xử lý lỗi ngay từ gốc.

---

### 7. Takeaway 5: Khi nào nên dùng MLVs thay thế ETL truyền thống?

MLV rất mạnh mẽ, nhưng không phải là "chiếc đũa thần" cho mọi tình huống. Với tư cách là kiến trúc sư, bạn cần lưu ý:

* **Hạn chế kỹ thuật:** MLV hiện chưa hỗ trợ các hàm cửa sổ (Window Functions như `RANK()`, `OVER`) trong chế độ Incremental Refresh. Ngoài ra, tên Schema không được viết hoa toàn bộ (ví dụ: `MYSCHEMA` sẽ không hợp lệ).
* **Khả năng tương thích:** MLVs hiện chưa được hỗ trợ trực tiếp trong Fabric Warehouse (T-SQL engine). Chúng chỉ hoạt động trong môi trường Lakehouse.

**Quy tắc ra quyết định nhanh (Rule of Thumb):**

* **Ưu tiên MLV khi:** Logic biến đổi có thể viết bằng SQL thuần túy, ưu tiên hiển thị trên Power BI Direct Lake, và dữ liệu chủ yếu là thêm mới (Append-only).
* **Dùng Spark Notebook/Pipeline khi:** Cần xử lý logic cực kỳ phức tạp (sử dụng thư viện Python), các bài toán Machine Learning, hoặc xử lý dữ liệu không phải dạng bảng (như ảnh, video).

---

### Kết luận: Tương lai của Kỹ thuật Dữ liệu Tuyên bố (Declarative Data Engineering)

Materialized Lake Views trong Microsoft Fabric đại diện cho một sự dịch chuyển chiến lược: từ việc "tự xây dựng thủ công" sang "tận dụng sức mạnh nền tảng". 

Việc tự động hóa quản lý phụ thuộc, tối ưu hóa chi phí và bảo vệ chất lượng dữ liệu giúp doanh nghiệp tối ưu hóa chi phí (TCO) và giải phóng nguồn lực cho các sáng kiến AI/ML quan trọng hơn.

Nếu hệ thống dữ liệu của bạn có thể tự quản lý sự phụ thuộc và chất lượng, đội ngũ của bạn sẽ dành thời gian đó để tạo ra giá trị kinh doanh mới nào? Hãy bắt đầu trải nghiệm MLV ngay hôm nay để đón đầu xu hướng kỹ thuật dữ liệu hiện đại!


<!-- en -->

# Microsoft Fabric Materialized Lake Views: The "Secret Weapon" for Automated, High-Performance Data Pipelines

### 1. Introduction: The Paradox of Speed vs. Data Freshness
As data strategy leaders, we constantly face a classic trade-off: **Flexibility versus Performance.**

* On one hand, we have **Virtual Views**: Extremely flexible but "compute-hungry" every time they are queried. This leads to unpredictable Capacity costs and a sluggish user experience.
* On the other hand, we have **Physical Tables**: Fast to query but a nightmare to maintain. Data engineers spend countless hours building complex Orchestration pipelines and handling manual errors.

The question for data leaders is: Is there a solution that allows us to simply "declare" our business logic and let the platform automate the "plumbing," while ensuring optimal query speeds? 

The answer is **Materialized Lake Views (MLVs)** – a revolutionary architectural shift within the Microsoft Fabric ecosystem.

---

### 2. Takeaway 1: Materialized Lake Views (MLVs) – Redefining the "Declarative Pipeline"
An MLV isn't just a "view"; it’s a hybrid data structure combining the abstraction of a SQL View with the physical storage power of Delta Lake on OneLake. Unlike traditional database systems, MLVs in Fabric are fully managed by the Spark engine.

Core characteristics include:
* **Native Storage:** Results are saved directly as standardized Delta/Parquet files. This allows other engines (Spark, T-SQL, Power BI) to access the data directly without copying.
* **Declarative Model:** Engineers simply define the "desired state" using SQL. Fabric automatically handles the data freshness.
* **Dependency Management (DAG):** The platform automatically recognizes the Lineage. When source tables change, downstream MLVs are updated in the correct logical order without manual coordination code.

> *"Materialized Lake Views help businesses shift from 'building and maintaining pipelines' to 'creating query-ready data assets.' This is the key to reducing Total Cost of Ownership (TCO) and accelerating business value."*

---

### 3. Takeaway 2: Optimal Refresh – Smarter, Leaner, and More Cost-Effective
The true power of MLVs lies in the **Optimal Refresh** engine. Instead of blindly running a Full Refresh and wasting Capacity, Fabric analyzes the Delta Logs of the source tables to choose the most efficient strategy:

| Refresh Strategy | Trigger Condition | TCO & Performance Impact |
| :--- | :--- | :--- |
| **No Refresh (Skip)** | No new commits in the source Delta log. | 100% compute savings. |
| **Incremental Refresh** | For Append-only data with Change Data Feed (CDF) enabled. | Processes only new records; highly efficient for Big Data. |
| **Full Refresh** | Non-deterministic logic, source Updates/Deletes, or very small datasets. | Ensures 100% data accuracy. |

**Pro Tip for Architects:** The system automatically reverts to Full Refresh if the Incremental cost exceeds the Full Refresh cost. To enable Incremental mode, you must set `delta.enableChangeDataFeed = true` on your source tables. Note that DELETE or UPDATE operations on source tables currently disable the Incremental mechanism.

---

### 4. Takeaway 3: Quality Control at the Point of Computation
MLVs act as intelligent "checkpoints" for data quality using **SQL Constraints**. By embedding quality rules directly into the view, you prevent "garbage data" from polluting your Gold layer at the moment of materialization.

Two core strategies:
1.  **ON MISMATCH DROP:** Automatically removes violating records (e.g., negative unit prices). Perfect for cleaning data in the Silver layer.
2.  **ON MISMATCH FAIL:** Halts the entire pipeline and triggers an error if a critical violation is detected (e.g., unbalanced financial totals). This is the mandatory "safety gate" for Gold-layer reporting.

**Technical Note:** Columns used in a `CONSTRAINT` must be present in the `SELECT` statement, or the materialization will fail.

---

### 5. Takeaway 4: MLVs & Power BI Direct Lake – Ending the "Fallback" Nightmare
For large-scale analytics, maintaining **Direct Lake** mode in Power BI is the ultimate goal. Standard Virtual Views often force Power BI into "DirectQuery" mode (known as Fallback), leading to high latency and bottlenecking the SQL Analytics Endpoint.

MLVs solve this because:
* **VertiPaq Performance:** Since MLVs are physical Delta files, Power BI’s VertiPaq engine loads them directly into memory. You get Import-level speed with real-time freshness.
* **Scalability:** By keeping data in memory, MLVs reduce the load on compute engines, ensuring a smooth experience regardless of user volume.
* **Storage Optimization:** We recommend optimizing MLV Parquet files to target ~400MB per file or roughly 2 million rows for peak performance.

---

### 6. Practical Guide: Implementing Medallion Architecture with AdventureWorks
Let’s simulate building a data layer in 10 minutes:

1.  **Setup:** Initialize a Lakehouse with "Schema" support enabled.
2.  **Bronze Layer:** Load raw tables like `SalesOrderHeader`. Enable CDF:  
    `ALTER TABLE adventureworks_bronze.salesorderheader SET TBLPROPERTIES (delta.enableChangeDataFeed = true)`.
3.  **Silver Layer (MLV):** Create an MLV to clean data and join `Address` with `StateProvince`. Set `ON MISMATCH FAIL` to block addresses missing region codes.
4.  **Gold Layer (MLV):** Create an aggregate view for revenue by region. Use `ON MISMATCH DROP` to filter out transactions with missing credit card info.
5.  **Operation:** Set a Schedule in the Lakehouse. Fabric will track the progress via the Lineage View.

---

### 7. Takeaway 5: When to use MLVs vs. Traditional ETL?
MLVs are powerful but not a silver bullet. As an architect, keep these constraints in mind:
* **Technical Limits:** Currently, Window Functions (`RANK()`, `OVER`) are not supported in Incremental Refresh mode. Also, Schema names cannot be all uppercase (e.g., `MYSCHEMA` is invalid).
* **Compatibility:** MLVs are currently supported in **Lakehouses**, not yet directly in the Fabric Warehouse (T-SQL engine).

**Rule of Thumb:**
* **Use MLVs when:** Your logic is pure SQL, you prioritize Power BI Direct Lake, and your data is primarily Append-only.
* **Use Spark Notebooks/Pipelines when:** You need complex Python libraries, Machine Learning, or non-tabular data (images/video) processing.

---

### Conclusion: The Future of Declarative Data Engineering
Materialized Lake Views in Microsoft Fabric represent a strategic shift: from "manual building" to "platform leverage." By automating dependency management, optimizing costs via CDF, and protecting quality with SQL Constraints, businesses can optimize TCO and free up resources for high-priority AI/ML initiatives.

If your data pipeline could manage its own dependencies and quality, what new business value would your team create with that extra time? Start your MLV-first journey today!
