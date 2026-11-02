
<?php
/** @var $category ?\App\Model\Category */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="category[name]"
           value="<?= htmlspecialchars($category ? $category->getName() ?? '' : '', ENT_QUOTES, 'UTF-8') ?>"
           required>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
