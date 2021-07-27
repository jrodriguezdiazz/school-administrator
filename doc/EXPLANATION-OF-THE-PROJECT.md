# School Administrator

## 🔍 Scope

This application will allow the user to manage the students of a school

1. Register students
2. Delete students
3. Modify students
4. See the list in these on a table
5. Download Biography of Students

---

## 📃 Student Registration

There are 2 ways to enter students

### 📝 **By form**.

- This will allow entering:
  - Name
  - Last name
  - Age
- Will allow annex to the student's biography file
  - TXT File
  - Word
  - PDF

### 📄 **By file in XML format**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<students>
   <student>
      <name>miguel</name>
      <lastname>martinez</lastname>
      <age>23</age>
   </student>
   <student>
      <name>Mogock</name>
      <lastname>Perez</lastname>
      <age>50</age>
   </student>
   <student>
      <name>Eliezer</name>
      <lastname>Ramos</lastname>
      <age>15</age>
   </student>
</students>
```

## ✍️ **Notes:** 

- Student information should be saved in Backend using any technology.

- In the grid where the student list is displayed, you have to have a button to lower biography.

- If a student via XML is recorded, it is not necessary to add a bibliographic document
